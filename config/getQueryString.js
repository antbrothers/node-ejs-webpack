/*
 * @Author: linjianx 
 * @Date: 2019-06-12 17:47:33 
 * @Last Modified by: linjianx
 * @Last Modified time: 2019-06-13 09:48:03
 */
export function getQueryString(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2])
  };
  return null;
}