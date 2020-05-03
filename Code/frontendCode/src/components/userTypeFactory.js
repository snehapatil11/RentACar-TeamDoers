class UserTypeFactory {

    static userTypeURL(userType) {
     if(userType === 'admin') {

        return '/adminMembership/';
     }
     else{
        return '/profile/';
     }
    
    }

}

export default UserTypeFactory;