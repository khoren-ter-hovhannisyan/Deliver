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
    successCreatedMessage: 'Delivere created',
    errorPendingMessage: 'Our admin team is reviewing your sign up request. Please wait for the response!',
    errorDeclinedMessage: 'Your sign-up request has unfortunately been declined. Please contact our administration for more information.',
    errorNoContent: 'No more conten',
    errorAlreadyExists: 'Email already exists',
    successDeletedMessage: 'Deliverer deleted',
    errorOldPasswordMessage: ' Old Password is incorrect'
  },
  img: {
    companyAvatar: 'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217691/uy4ik67icwc2a9rmabnn.png',
    userAvatar: 'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217677/q608defvqrdhobxrjhw1.png',
  },
  selectTypes: {
    orderForUpdate: 'state points order_description take_address deliver_address order_start_time order_end_time receiver_name receiver_phone comment companyId userId',
    orderForCompanies: 'state points order_description take_address deliver_address order_start_time order_end_time receiver_name receiver_phone comment userId',
    orderForActiveOrders: 'state points order_description take_address deliver_address order_start_time order_end_time receiver_name receiver_phone comment companyId',
    orderForUser: 'state points order_description take_address deliver_address order_start_time order_end_time receiver_name receiver_phone comment companyId',
    userGetAll: 'name lastName email phone address type approved passportURL avatar amount rating createdTime',
    userGetbyId: 'name lastName email phone address type approved passportURL avatar amount rating'
  },
}