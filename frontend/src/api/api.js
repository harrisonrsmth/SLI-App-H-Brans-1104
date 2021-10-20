import axios from 'axios'

export class Api {
  url = 'http://localhost:5000';

  config = {
    headers: {
      authorization: 'abc',
    }
  }

  login(form) {
     var tk = new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/authenticateLogin`, form, this.config)
           .then(x => {
                console.log(x.data["token"]);
                localStorage.setItem("token", x.data["token"]);
                resolve(x.data)
           })
           .catch(x => {
              alert(x);
              reject(x);
           })
     })
     var delayInMilliseconds = 10000; //1 second

     setTimeout(function() {
       //your code to be executed after 1 second
     }, delayInMilliseconds);
     console.log(tk);
     alert("SLKFJSLKF");
     return tk;
  }

  getUserByToken(token) {
      var data = {'token': token};
      return new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/getCurrentUserToken`, data, this.config)
            .then(x => {
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


    createNewClass(form) {
        return new Promise((resolve, reject) => {
            axios.post(`${this.url}/api/createNewClass`, form, this.config)
                .then(x => {
                    resolve(x.data);
                })
                .catch(x => {
                    console.log("error");
                    reject(x);
                })
        })
    }

  logOut(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/logout`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  createAccount(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/createAccount`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getAllClass(form) {
    var id = localStorage.getItem("userID");
    var data = {"teacher_id": id}
    return new Promise((resolve, reject) => {
          axios.post(`${this.url}/api/getAllClass`, form, this.config)
          .then(x => {
            resolve(x.data);
          })
          .catch(x => {
            reject(x);
          })
        });
  }

  getStudentList(form) {
      return new Promise((resolve, reject) => {
            axios.post(`${this.url}/api/getStudentsFromClass`, form, this.config)
            .then(x => {
              resolve(x.data);
            })
            .catch(x => {
              reject(x);
            })
          });
    }


  retrievePassword(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/sendPasswordEmail`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  logWork(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/logWork`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getCampaigns() {
    var username = localStorage.getItem("username")
    var data = {"username": username}
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/getCampaigns`, data, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getGoal() {
    var username = localStorage.getItem("username")
    var data = {"username": username}
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/getGoal`, data, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

}
