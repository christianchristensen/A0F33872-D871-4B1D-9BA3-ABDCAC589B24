import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function loadIP()
{
  if (window.location.hash)
  {
    load(window.location.hash.substring(1));
  }
  else
  {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.timeout=3000; // 3s timeout, TODO: determine howto timeout/else into random ip
    xmlhttp.onreadystatechange=await function()
      {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
          load(xmlhttp.responseText);
        }
      };
    xmlhttp.open("GET","//i.uti.ng",true);
    xmlhttp.send();
  }
}

async function load(ip='1.1.1.1') {
  //document.getElementById("txtDiv").innerHTML=ip;
  window.location.hash = ip;
  const ipInt = require('ip-to-int');

  const worker = await createDbWorker(
    [
      {
        from: "jsonconfig",
        configUrl: "/db_dir/config.json"
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  const ipdec=ipInt(ip).toInt();
  const result = await worker.db.query(`SELECT r.cidr,r.asN AS asn,r.dec_width AS ip_width,a.name FROM routeviews_ipv4 r JOIN asn_names a ON r.asN=a.asn WHERE ?>=r.dec_start AND ?<=r.dec_end GROUP BY r.asN,r.dec_width ORDER BY r.dec_width ASC LIMIT 10;`,[ipdec,ipdec]);

  document.body.textContent = JSON.stringify(result);
}

loadIP();
