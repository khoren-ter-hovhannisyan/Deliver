module.exports = {
  status: {
    pendingStatus: 'pending',
    doneStatus: 'done',
    acceptedStatus: 'accepted',
    declinedStatus: 'declined',
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
  message: {
    errorMessage: 'Something went wrong, try later',
  },
}
