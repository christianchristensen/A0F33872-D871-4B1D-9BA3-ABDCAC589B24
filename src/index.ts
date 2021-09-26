import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load(){
  loadIP();
}

async function loadIP()
{
  if (window.location.hash)
  {
    // Fill IP on page...
    var t_ip = window.location.hash.substring(1);
    var d_t_ip = document.getElementById('t_ip');
    if (d_t_ip != null) {
      d_t_ip.textContent=t_ip;
    }
    loadASN(t_ip);
  }
  else
  {
    var xmlhttpIP=new XMLHttpRequest();
    xmlhttpIP.timeout=3000; // 3s timeout, TODO: determine howto timeout/else into random ip
    xmlhttpIP.onreadystatechange=await function()
      {
        if (xmlhttpIP.readyState==4 && xmlhttpIP.status==200)
        {
          // Fill IP on page...
          var t_ip = xmlhttpIP.responseText;
          var d_t_ip = document.getElementById('t_ip');
          if (d_t_ip != null) {
            d_t_ip.textContent=t_ip;
          }
          loadASN(t_ip);
        }
      };
    xmlhttpIP.open("GET","//i.uti.ng/ip",true);
    xmlhttpIP.send();
  }
}

async function loadASN(ip='1.1.1.1')
{
  // reverse ip for DOH routeviews lookup
  var is=ip.split('.');
  var rip=is[3]+'.'+is[2]+'.'+is[1]+'.'+is[0];
  var xmlhttpASN=new XMLHttpRequest();
  xmlhttpASN.timeout=3000; // 3s timeout, TODO: determine howto timeout/else into random ip
  xmlhttpASN.onreadystatechange=await function()
    {
      if (xmlhttpASN.readyState==4 && xmlhttpASN.status==200)
      {
        if (xmlhttpASN.responseText.includes('asn.routeviews')) {
          // Fill ASN on page...
          var asn = JSON.parse(xmlhttpASN.responseText).Answer[0].data.split('"');
          var d_t_asn = document.getElementById('t_asn');
          if (d_t_asn != null) {
            d_t_asn.textContent=asn[1];
          }
          var d_t_subnet = document.getElementById('t_subnet');
          if (d_t_subnet != null) {
            d_t_subnet.textContent=asn[3] + "/" + asn[5];
          }

          loadSQL(asn[1]);
        }
      }
    };
  xmlhttpASN.open("GET","//d.uti.ng?name="+rip,true);
  xmlhttpASN.setRequestHeader('Accept', 'application/dns-json');
  xmlhttpASN.send();
}

async function loadSQL(asn=13335) {
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

  const result = await worker.db.query(`SELECT name FROM asn_names WHERE asn=? LIMIT 10;`,[asn]);
  var d_t_asname = document.getElementById('t_asname');
  if (d_t_asname != null) {
    d_t_asname.textContent=JSON.stringify(result[0]).split('"')[3];
  }
}

load();
