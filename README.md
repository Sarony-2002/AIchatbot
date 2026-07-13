After you edit the code, run this from the project folder:
dotnet run --launch-profile http
Then open:
http://localhost:5202
If it says the port is already in use, stop the old running app first. In the terminal where it is running, press:
Ctrl + C
Then run it again:
dotnet run --launch-profile http
A good habit after code changes:
dotnet build
dotnet run --launch-profile http