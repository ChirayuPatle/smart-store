# autogenerate deployment 
`kubectl create deploy smart-store --image=chirayupatle/smart-store:v1 --dry-run=client -o yaml > k8s/manifests/deployment.yaml`

# autogenerate service
``