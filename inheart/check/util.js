var util = {};


util.successTrue = function(data){
    return {
      success:true,
      message:null,
      errors:null,
      data:data
    };
  };
  
util.successFalse = function(err, message){
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};