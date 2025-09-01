setInterval(() => {
  const d = new Date();
  let htime = d.getHours();
  let mtime = d.getMinutes();
  let stime = d.getSeconds();

  htime = htime < 10 ? "0" + htime : htime;
  mtime = mtime < 10 ? "0" + mtime : mtime;
  stime = stime < 10 ? "0" + stime : stime;

  document.getElementById("hour").innerText = htime + ":";
  document.getElementById("minute").innerText = mtime + ":";
  document.getElementById("second").innerText = stime + "";
}, 10);
