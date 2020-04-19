class UserTypeFactory {

    static userTypeURL(userType) {
     if(userType === 'admin') {

        return '/admin/profile/';
     }
     else{
        return '/profile/';
     }
    
    }

}

export default UserTypeFactory;