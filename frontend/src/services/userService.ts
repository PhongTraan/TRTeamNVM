import axios from "axios";
import { UserFilerType, UserPaginationResponseType } from "../data/User";
import {
  getAllUserFalse,
  getAllUserStart,
  getAllUserSuccess,
} from "../redux/slice/userSlice";

const apiUrl = "http://localhost:3000";

class UserService {
  static async getAllUser(
    filters: UserFilerType,
    dispatch: any
    // navigate: any
  ): Promise<UserPaginationResponseType> {
    dispatch(getAllUserStart());
    try {
      const response = await axios.get(`${apiUrl}/users/getAllUser`, {
        params: {
          items_per_page: filters.items_per_page || "10",
          page: filters.page || 1,
          search: filters.search || "",
        },
      });

      const data: UserPaginationResponseType = {
        data: response.data.data,
        total: response.data.total,
        currentPage: filters.page || 1,
        itemsPerPage: filters.items_per_page || 10,
      };

      dispatch(getAllUserSuccess(data));

      return data;
    } catch (error: any) {
      dispatch(getAllUserFalse(error));
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

export default UserService;
