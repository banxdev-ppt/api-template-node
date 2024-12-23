const formatFilename = (originalFilename, type, user_id) => {
  switch (type) {
    case 'profiles': {
      const date = new Date().toISOString().split('T')[0];
      return `${date}_${originalFilename}`;
    }
    case 'products': {
      const date = new Date().toISOString().split('T')[0];
      return `${date}_${user_id}_${originalFilename}`;
    }
    default:
      break;
  }
};

module.exports = { formatFilename };
