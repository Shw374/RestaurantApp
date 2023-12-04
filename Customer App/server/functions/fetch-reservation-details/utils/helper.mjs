export const hasMenuType = (restaurant, menuType) =>{
    return restaurant.menu.hasOwnProperty(menuType.toLowerCase());
  }
  
  export const hasMenuItem = (restaurant, menuType, menuItem) => {
    const lowerCaseMenuType = menuType.toLowerCase();
    if (
      restaurant.menu.hasOwnProperty(lowerCaseMenuType) &&
      restaurant.menu[lowerCaseMenuType].length > 0
    ) {
      const availableMenuItems = restaurant.menu[lowerCaseMenuType].filter(
        (item) => parseInt(item.quantity) > 0
      );
  
      const menuItemExists = availableMenuItems.some(
        (item) => item.menu_name === menuItem
      );
  
      if (menuItemExists) {
        return true;
      }
    }
  
    return false;
  }
  
  export const filterAvailableMenuItems = (menu, menuType) => {
    const lowerCaseMenuType = menuType.toLowerCase();
    const availableMenuItems = [];
  
    if (menu.hasOwnProperty(lowerCaseMenuType)) {
      const items = menu[lowerCaseMenuType].filter(
        (item) => parseInt(item.quantity) > 0
      );
      availableMenuItems.push(...items);
    }
  
    return availableMenuItems;
  }
  
  export const formatDateTime = (dateString, timeString) => {
    // Combine date and time strings
    const combinedDateTimeString = `${dateString}T${timeString}:00`;
  
    // Create a Date object from the combined string
    const dateTime = new Date(combinedDateTimeString);
  
    // Format the Date object to "yyyy-MM-ddTHH:mm:ssZ"
    const formattedDateTimeString = dateTime.toISOString();
  
    return formattedDateTimeString;
  }
  
  export const formatDateTimeWithOneHourAdded = (dateString, startTimeString) => {
    // Combine date and time strings
    const combinedDateTimeString = `${dateString}T${startTimeString}:00`;
  
    // Create a Date object from the combined string
    const dateTime = new Date(combinedDateTimeString);
  
    // Add one hour to the date and time
    dateTime.setHours(dateTime.getHours() + 1);
  
    // Format the updated Date object to "yyyy-MM-ddTHH:mm:ssZ"
    const formattedDateTimeString = dateTime.toISOString();
  
    return formattedDateTimeString;
  }