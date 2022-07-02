export function formatDatetime(datetime, seconds = false, milliseconds = false){
    let dt = new Date(datetime);
    const d = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    const m = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const y = dt.getFullYear();
    const hh = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
    const mm = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
    const ss = dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds();
    const ms = dt.getMilliseconds() < 10 ? '00' + dt.getMilliseconds() : (dt.getMilliseconds() < 100 ? '0' + dt.getMilliseconds() : dt.getMilliseconds());
    return d + '.' + m + '.' + y + ' ' + hh + ':' + mm + (seconds ? (milliseconds ? ':' + ss + '.' + ms : ':' + ss) : '');
}
