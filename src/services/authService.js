import Axios from 'axios'
import { API_SERVER } from '../config'

class AuthService {
    login (user) {
        return Axios.post(API_SERVER)
    }
}

export default new AuthService()