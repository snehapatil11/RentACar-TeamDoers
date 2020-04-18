class UserTypeFactory {

    static userTypeURL(userType) {
     if(userType === 'admin') {

        return '/admin/profile/';
     }
     else{
        return '/user/profile/';
     }
    
    }

}

export default UserTypeFactory;