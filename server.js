var http = require("http");
var sensorLib = require("node-dht-sensor");
var fs = require("fs");

http.createServer(function (request, response)
{
  fs.readFile('./bars_template.html', 'ascii', function(err, html_string)
  {
    if (err)
    {
      response.writeHead(500);
      response.end("<h1>Error 500</h1>");
    }
    else
    {
      var sensorResult = sensorLib.read(22, 12);
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(build_string(html_string.toString(), 
         sensorResult.temperature.toFixed(1), 
         sensorResult.humidity.toFixed(1)));
    }
  });
}).listen(8081);

console.log("Server running on port 8081");

function build_string(html_str, temperature, humidity)
{
  var result_array=[];
  var MAX_TEMP=40;
  var MIN_TEMP=-10;

  if (temperature > MAX_TEMP) { temperature = MAX_TEMP; }
  if (temperature < MIN_TEMP) { temperature = MIN_TEMP; }

  var R = parseInt(255 * ((temperature - MIN_TEMP) / 
     (MAX_TEMP - MIN_TEMP)));
  var G = 0;
  var B = 255-R;

  result_array[0]=200;
  result_array[3]="right"

  if (temperature<0)
  {
    result_array[0]=200+(temperature*20);
    result_array[3]="left"
  }

  result_array[1]=Math.abs(temperature)*20;
  result_array[2]= "rgb(" + R + "," + G + "," + B + ")";
  result_array[4]=temperature*9/5+32;
  result_array[5]=humidity*10;
  result_array[6]=humidity;

  var temp="";

  for (i=0; i<result_array.length; i++)
  {
      temp=html_str.replace("{"+i.toString()+"}", 
         result_array[i].toString());
      html_str=temp;
  }

  return (html_str);
}
