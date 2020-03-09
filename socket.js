const CONSTANTS = require('./src/services/constans')

exports.socketLiseners = socket => {
    socket.on(CONSTANTS.socketListeners.newAccount, async accountData => {
      const user = await User.findOne({
        email: accountData.data.email,
      })
      const company = await Company.findOne({
        email: accountData.data.email,
      })
      if (user) {
        socket.broadcast.emit(CONSTANTS.socketEmiters.updateUserList, {
          id: user._id,
          name: user.name,
          lastName: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          type: user.type,
          approved: user.approved,
          passportURL: user.passportURL,
          avatar: user.avatar,
          amount: user.amout,
          rating: user.rating,
          createdTime: Date.parse(user.createdTime),
        })
      } else if (company) {
        socket.broadcast.emit(CONSTANTS.socketEmiters.updateCompanyList, {
          id: company._id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          taxNumber: company.taxNumber,
          address: company.address,
          approved: company.approved,
          activity: company.activity,
          avatar: company.avatar,
          amount: company.amount,
          createdTime: Date.parse(company.createdTime),
        })
      } else {
        return res.status(500).send({
          message: CONSTANTS.message.errorMessage,
        })
      }
    })
    socket.on(CONSTANTS.socketListeners.deleteUser, () => {
      socket.broadcast.emit('deleted_user', {
        data: 'User has been deleted, please refresh',
      })
    })
    socket.on('delete_company', () => {
      socket.broadcast.emit('deleted_company', {
        data: 'Company has been deleted, please refresh',
      })
    })
    socket.on('new_order', orderData => {
      Order.findOne({
        companyId: orderData.data.companyId,
      })
        .then(data => {
          socket.broadcast.emit('update_order_list', data)
        })
        .catch(err => {
          return res.status(500).send({
            message: CONSTANTS.message.errorMessage,
            err,
          })
        })
    })
    socket.on('delete_order', () => {
      socket.broadcast.emit('deleted_order', {
        data: 'Order has been deleted, please refresh',
      })
    })
  }