ssh -i "InventoryManagementApp.pem" ubuntu@ec2-13-203-48-152.ap-south-1.compute.amazonaws.com

scp -i "InventoryManagementApp.pem" -r .next ubuntu@ec2-13-203-48-152.ap-south-1.compute.amazonaws.com:~/proj/build/.