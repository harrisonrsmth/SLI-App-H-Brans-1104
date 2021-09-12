import axios from 'axios'

export class Api {
  url = 'http://localhost:5000';

  config = {
    headers: {
      authorization: 'abc',
    }
  }

  login(form) {
     return new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/authenticateLogin`, form, this.config)
           .then(x => resolve(x.data))
           .catch(x => {
              alert(x);
              reject(x);
           })
     })
  }

  getUserByToken(token) {
      var data = {'token': token};
      return new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/getCurrentUserToken`, data, this.config)
            .then(x => {
                localhostStorage.setItem(x.data["token"]);
                resolve(x.data);
                }
            )
            .catch(x => {
                reject(x);
            })
      })
    }

    async getCurrentUser() {
      let user = null;
      await this.getUserByToken(localStorage.getItem('token'))
        .then(data => user = data)
      return user;
    }
}
