export function formatDatetime(datetime){
    let dt = new Date(datetime);
    return dt.getDate() + '.' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '.' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes();
}
