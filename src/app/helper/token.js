export const getToken = () => {
    let token =JSON.parse(window.localStorage.getItem('inv-management-token'));
    //dwst verify token
    return token; 
}

export const setToken = (token) => {
    window.localStorage.setItem('inv-management-token', JSON.stringify(token));
}

export const removeToken = () => {
    window.localStorage.removeItem('inv-management-token');
}

export const getInvUser = () =>{
    let user = JSON.parse(window.localStorage.getItem('inv-management-user'));
    return user;
 
}

export const setInvUser = (user) => {
    window.localStorage.setItem('inv-management-user', JSON.stringify(user));

}

export const removeInvUser = () => {
    window.localStorage.removeItem('inv-management-user');

}