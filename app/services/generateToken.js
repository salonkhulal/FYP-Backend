
const generateToekn=()=>{
     const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeDueTime = new Date(Date.now() + 2 * 60 * 1000);
    return { confirmCode, codeDueTime };
}
export default generateToekn;