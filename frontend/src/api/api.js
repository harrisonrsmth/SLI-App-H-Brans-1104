import axios from 'axios'

export class Api {
  url = 'http://127.0.0.1:5000';

  config = {
    headers: {
      authorization: 'abc',
    }
  }

  login(form) {
     return new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/authenticateLogin`, form, this.config)
           .then(x => {
                console.log(x.data["token"]);
                sessionStorage.setItem("token", x.data["token"]);
                resolve(x.data)
           })
           .catch(x => {
              alert(x);
              reject(x);
           })
     });
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
      await this.getUserByToken(sessionStorage.getItem('token'))
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
    var id = sessionStorage.getItem("userID");
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


  sendPasswordEmail(form) {
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

  getResetLinkUser(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/getResetLinkUser`, form, this.config)
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

  /**
   * Retrieves username and role of user from sessionStorage to create JSON data and sends GET request
   * to backend to retrieve the campaigns assigned to or owned by the given user
   * 
   * @returns Promise containing response data from GET request with the following items:
   *    "code": 1 for success, 0 for failure
   *    "campaignList": list of campaigns assigned to or owned by the user in format [campaign name, total_hours, due_date]
   */
  getCampaigns(form) {
    var username = sessionStorage.getItem("username")
    var role = sessionStorage.getItem("role")
    var className = form["currentClass"]
    var data = {"username": username, "role": role, "className": className}
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
    var username = sessionStorage.getItem("username")
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

  createCampaign(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/createCampaign`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  createGoal(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/createGoal`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  resetPassword(form) {
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/setNewPassword`, form, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getClasses() {
    var username = sessionStorage.getItem("username")
    var data = {"username": username}
    return new Promise((resolve, reject) => {
      axios.post(`${this.url}/api/getClassesList`, data, this.config)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

}
