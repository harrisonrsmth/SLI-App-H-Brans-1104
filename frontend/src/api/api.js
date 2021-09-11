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
        axios.post(`${this.url}/login`, form, this.config)
           .then(x => resolve(x.data))
           .catch(x => {
              alert(x);
              reject(x);
           })
     })
  }
}
