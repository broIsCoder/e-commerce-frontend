const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = new Date(dateString).toLocaleDateString(
    "np-NP",
    options
  );
  
  return formattedDate.replace(/ GMT[+-]\d{1,2}:\d{2}/, '');
};

export default formatDate;
