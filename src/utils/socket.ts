import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { configEnv } from '~/constants/configENV'
import { conversationsModel } from '~/models/model/conversations.model'
import { notificationModel } from '~/models/model/notification.model'

export const socketConfig = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: configEnv.URL_CLIENT,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  })

  const user: any = {}
  io.on('connection', async (socket) => {
    const user_id = socket.handshake.auth?._id
    if (user_id) {
      user[user_id] = {
        socket_id: socket.id
      }
    }
    // console.log(user)
    socket.on('message_private', async (data: { content: string; to: string; from: string }) => {
      try {
        const receiver_socket_id = user[data.to]?.socket_id
        socket.to(receiver_socket_id).emit('send_message', data)
        await conversationsModel.create({
          sender_id: new mongoose.Types.ObjectId(data.from),
          receiver_id: new mongoose.Types.ObjectId(data.to),
          content: data.content
        })
      } catch (error: unknown) {
        console.log(error)
      }
    })
    socket.on('enter_text', (data) => {
      const receiver_socket_id = user[data.to]?.socket_id
      socket.to(receiver_socket_id).emit('listen_for_text_input_events', 'enter')
    })

    socket.on('no_enter_text', (data) => {
      const receiver_socket_id = user[data.to]?.socket_id
      socket.to(receiver_socket_id).emit('no_text_input_events', 'no_enter')
    })
    const GenerateSocket = ({ receiver_type, sender_type }: { receiver_type: string; sender_type: string }) => {
      socket.on(
        receiver_type,
        async (data: {
          tweet_id: string
          to: string
          avatar: string
          status: string
          username: string
          from?: string
        }) => {
          try {
            const receiver_socket_id = user[data.to]?.socket_id
            socket.to(receiver_socket_id).emit(sender_type, data)

            await notificationModel.create({
              tweet_id: data.status !== 'message' ? new mongoose.Types.ObjectId(data.tweet_id) : null,
              receiver_id: new mongoose.Types.ObjectId(data.to),
              avatar: data.avatar,
              status: data.status,
              username: data.username,
              sender_id: data.from !== null && data.from !== '' ? new mongoose.Types.ObjectId(data.from) : null
            })
          } catch (error: unknown) {
            console.log(error)
          }
        }
      )
    }

    GenerateSocket({ receiver_type: 'send_notification_like', sender_type: 'notification_like' })
    GenerateSocket({ receiver_type: 'send_notification_bookmark', sender_type: 'notification_bookmark' })
    GenerateSocket({ receiver_type: 'send_notification_comment', sender_type: 'notification_comment' })
    GenerateSocket({ receiver_type: 'send_notification_reply_comment', sender_type: 'notification_reply_comment' })
    GenerateSocket({ receiver_type: 'send_notification_message', sender_type: 'notification_message' })
    GenerateSocket({ receiver_type: 'send_notification_mentions', sender_type: 'notification_mentions' })

    socket.on('follow_user', async (data) => {
      const receiver_socket_id = user[data.to]?.socket_id
      socket.to(receiver_socket_id).emit('following_user', data)
      try {
        await notificationModel.findOneAndUpdate(
          {
            sender_id: new mongoose.Types.ObjectId(data.from),
            receiver_id: new mongoose.Types.ObjectId(data.to),
            status: data.status
          },
          {
            $setOnInsert: {
              sender_id: new mongoose.Types.ObjectId(data.from),
              receiver_id: new mongoose.Types.ObjectId(data.to),
              avatar: data.avatar,
              status: data.status,
              username: data.username
            }
          },
          {
            new: true,
            upsert: true
          }
        )
      } catch (error: unknown) {
        console.log(error)
      }
    })

    socket.on('check_user_active', (data) => {
      let checkUserActive: string[] = Object.keys(user)
      if (data.offTab) {
        checkUserActive = checkUserActive.filter((user_id) => user_id !== data.user_id)
      }
      if ((checkUserActive as string[]).includes(data.user_id)) {
        socket.emit('check_user_active_client', true)
        return
      } else {
        socket.emit('check_user_active_client', false)
        return
      }
    })

    socket.on('disconnect', () => {
      delete user[user_id]
      // console.log('co user da roi khoi', socket.id)
      // console.log(user)
    })
  })
}
