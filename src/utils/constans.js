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
    userTakeOrder: 'user_take_order'
  },
  socketEmiters: {
    updateUserList: 'update_user_list',
    updateCompanyList: 'update_company_list',
    deletedUser: 'deleted_user',
    deletedCompany: 'deleted_company',
    updateOrderList: 'update_order_list',
    deletedOrder: 'deleted_order',
    userTookOrder: 'user_took_order'
  },
  messages: {
    errorMessage: 'Something went wrong, try later',
    errorAuthfailed: 'Auth failed: email or password is incorrect',
    errorPendingMessage: 'Our admin team is reviewing your sign up request. Please wait for the response!',
    errorDeclinedMessage: 'Your sign-up request has unfortunately been declined. Please contact our administration for more information.',
    errorNoContent: 'No more conten',
    errorAlreadyExists: 'Email already exists',
    errorOldPasswordMessage: ' Old Password is incorrect',
    errorUserCannotDel: 'The User cannot be deleted. The User has pending order(s)!',
    errorCompanyCannotDel: 'The company cannot be deleted. The company has pending order(s)!',
    errorNotEnoughMoney: `You can't create order, you don't enough money`,
    errorNoSuchUser: 'There is no such user',
    errorEmptyFields: 'Some input fields are wrong or empty',

    successDeletedMessage: 'Deliverer deleted',
    successOrderDeleted: 'Order deleted',
    successOrderRated: 'Order has been rated',
    successOrderUpdated: 'Order updated',
    successPasswordChanged: 'Password has changed',
    succsessAuthMessage: 'Auth successful',
    successCreatedMessage: 'Deliverer created',
    successCompanyDeleted: 'Company has been deleted',
    successCompanyCreated: 'Company successfully created'
  },
  img: {
    companyAvatar: 'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217691/uy4ik67icwc2a9rmabnn.png',
    userAvatar: 'https://res.cloudinary.com/dfeoo5iog/image/upload/v1583217677/q608defvqrdhobxrjhw1.png',
  },
  selectTypes: {
    orderForUpdate: 'state points order_description take_address deliver_address order_end_time receiver_name receiver_phone comment companyId userId rating ',
    orderForCompanies: 'state points order_description take_address deliver_address order_end_time receiver_name receiver_phone comment userId rating createdTime',
    orderForActiveOrders: 'state points order_description take_address deliver_address order_end_time receiver_name receiver_phone comment companyId rating createdTime',
    orderForUser: 'state points order_description take_address deliver_address order_start_time order_end_time receiver_name receiver_phone comment companyId rating createdTime',
    userGetAll: 'name lastName email phone address type approved passportURL avatar amount rating createdTime',
    userGetbyId: 'name lastName email phone address type approved passportURL avatar amount rating',
    companyGetAll: 'name email phone taxNumber address activity approved avatar amount createdTime',
    companyGetById: 'name email phone taxNumber address activity approved avatar amount',
  },
}