import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
} from "../redux/slice/authSlice";
import { LoginDto, RegisterDto } from "./../data/Auth";
import axios, { AxiosResponse } from "axios";

// const apiUrl = process.env.VITE__API_KEY;

const apiUrl = "http://localhost:3000";

class AuthService {
  static async register(newUser: RegisterDto, dispatch: any, navigate: any) {
    dispatch(registerRequest());
    try {
      await axios.post(`${apiUrl}/auth/register`, newUser);

      dispatch(registerSuccess(newUser));
      navigate("/login");
    } catch (error: any) {
      dispatch(registerFailure(error));
      console.log("Error in AuthService.register: ", error);
      throw error;
    }
  }

  static async login(
    user: LoginDto,
    dispatch: any,
    navigate: any
  ): Promise<any> {
    const { email, password } = user;
    dispatch(loginRequest());
    try {
      const response: AxiosResponse<LoginDto> = await axios.post(
        `${apiUrl}/auth/login`,

        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        console.log("False");
      }

      dispatch(loginSuccess(response.data));
      navigate("/");

      return response.data;
    } catch (error: any) {
      dispatch(loginFailure);
      throw new Error(
        error.response?.data?.message || "An error occurred during login."
      );
    }
  }
}

export default AuthService;
