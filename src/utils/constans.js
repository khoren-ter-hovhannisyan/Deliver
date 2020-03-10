module.exports = {
  types: {
    admin: 'admin',
    user: 'user',
    company: 'company',
  },
  status: {
    pending: 'pending',
    done: 'done',
    active: 'active',
    accepted: 'accepted',
    declined: 'declined',
  },
  socketListeners: {
    newAccount: 'new_account',
    deleteUser: 'delete_user',
    deleteCompany: 'delete_company',
    newOrder: 'new_order',
    deleteOrder: 'delete_order',
  },
  socketEmiters: {
    updateUserList: 'update_user_list',
    updateCompanyList: 'update_company_list',
    deletedUser: 'deleted_user',
    deletedCompany: 'deleted_company',
    updateOrderList: 'update_order_list',
    deletedOrder: 'deleted_order',
  },
  messages: {
    errorMessage: 'Something went wrong, try later',
    errorAuthfailed: 'Auth failed: email or password is incorrect',
    succsessAuthMessage: 'Auth successful',
  },
  img: {
    companyAvatar:
      'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217691/uy4ik67icwc2a9rmabnn.png',
    userAvatar:
      'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217677/q608defvqrdhobxrjhw1.png',
  },
}
