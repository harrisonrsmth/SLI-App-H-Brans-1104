import axios from 'axios'

export class Api {
  url = 'http://127.0.0.1:5000';

  login(form) {
     return new Promise((resolve, reject) => {
        axios.post(`${this.url}/api/authenticateLogin`, form)
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
        axios.get(`${this.url}/api/getCurrentUserToken`, {params: data})
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
            axios.post(`${this.url}/api/createNewClass`, form)
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
      axios.post(`${this.url}/api/logout`, form)
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
      axios.post(`${this.url}/api/createAccount`, form)
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getStudentList(form) {
      return new Promise((resolve, reject) => {
            axios.get(`${this.url}/api/getStudentsFromClass`, {params: form})
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
      axios.post(`${this.url}/api/sendPasswordEmail`, form)
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
      axios.post(`${this.url}/api/getResetLinkUser`, {params: form})
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
      axios.post(`${this.url}/api/logWork`, form)
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
    var current_class = form["current_class"]
    var data = {"username": username, "role": role, "current_class": current_class}
    return new Promise((resolve, reject) => {
      axios.get(`${this.url}/api/getCampaigns`, {params: data})
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
      axios.get(`${this.url}/api/getGoal`, {params: data})
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
      axios.post(`${this.url}/api/createCampaign`, form)
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
      axios.post(`${this.url}/api/createGoal`, form)
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
      axios.post(`${this.url}/api/setNewPassword`, form)
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
      axios.get(`${this.url}/api/getClassesList`, {params: data})
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getRecentWork(form) {
    form["role"] = sessionStorage.getItem("role")
    form["username"] = sessionStorage.getItem("username")
    return new Promise((resolve, reject) => {
      axios.get(`${this.url}/api/getRecentWork`, {params: form})
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getProgress(form) {
    form["role"] = sessionStorage.getItem("role")
    form["username"] = sessionStorage.getItem("username")
    return new Promise((resolve, reject) => {
      axios.get(`${this.url}/api/getProgress`, {params: form})
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

  getTotalHours(form) {
    form["role"] = sessionStorage.getItem("role")
    form["username"] = sessionStorage.getItem("username")
    return new Promise((resolve, reject) => {
      axios.get(`${this.url}/api/getTotalHours`, {params: form})
      .then(x => {
        resolve(x.data);
      })
      .catch(x => {
        reject(x);
      })
    })
  }

}
