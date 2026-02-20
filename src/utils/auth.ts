/**
 * Get the authentication token based on user role
 * Returns distributorToken if user is a distributor, otherwise returns userToken
 */
export const getAuthToken = (): string | null => {
  // Check if user is a distributor
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === "distributor") {
        return localStorage.getItem("distributorToken");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  
  // Return regular user token
  return localStorage.getItem("userToken");
};

/**
 * Check if user is logged in (has any valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if the logged-in user is a distributor
 */
export const isDistributor = (): boolean => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role === "distributor";
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return false;
};

/**
 * Logout user by clearing all auth tokens and user data
 */
export const logout = (): void => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("distributorToken");
  localStorage.removeItem("token"); // admin token
  localStorage.removeItem("user");
};
