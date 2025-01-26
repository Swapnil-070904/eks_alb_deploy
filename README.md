# Deploying Kubernetes Application with AWS Load Balancer Controller on Amazon EKS

This guide walks you through deploying a Kubernetes application with AWS Load Balancer Controller (ALB) using Amazon EKS and Fargate.

## Prerequisites
- AWS CLI installed and configured with your credentials.
- `eksctl` installed for creating and managing Amazon EKS clusters.
- Helm installed for installing the AWS Load Balancer Controller.
- A Kubernetes cluster running on Amazon EKS.
- The application to deploy should be containerized and available in a Docker repository.

## Steps

### Step 1: Create Namespace
First, create the namespace for your application.

```bash
kubectl apply -f ns.yml
```
Step 2: Create Fargate Profile for EKS
Create a Fargate profile for the EKS cluster. This allows your workloads to run on AWS Fargate.

```bash
eksctl create fargateprofile \
    --cluster <cluster-name> \
    --region ap-south-1 \
    --name gameApp \
    --namespace spsgame
```
Step 3: Associate IAM OIDC Provider
Ensure your EKS cluster is associated with an IAM OIDC provider. This is required for IAM roles to be assumed by the Kubernetes service account.

```bash
eksctl utils associate-iam-oidc-provider --cluster <cluster-name> --approve
```
Step 4: Apply Deployment Configuration
Now, apply the deployment configuration to your cluster.

```bash
kubectl apply -f deploy.yaml
```
Step 5: Create IAM Policy for Load Balancer Controller
Create the IAM policy for AWS Load Balancer Controller. This policy grants necessary permissions to manage ALBs.

```bash
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://policy.json
```
Step 6: Create IAM Service Account for Load Balancer Controller
Create an IAM service account in the kube-system namespace with the necessary IAM policy.
```bash
eksctl create iamserviceaccount \
  --cluster=<your-cluster-name> \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::<your-aws-account-id>:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve
```
Step 7: Install AWS Load Balancer Controller with Helm
Add the AWS EKS Helm repository and install the AWS Load Balancer Controller.

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \            
  -n kube-system \
  --set clusterName=<your-cluster-name> \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=<region> \
  --set vpcId=<your-vpc-id>
```
Step 8: Verify Installation
Check if the AWS Load Balancer Controller is successfully installed and running.

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
```
You should see the aws-load-balancer-controller running.

Step 9: Access Your Application
After deploying your application and configuring the load balancer, access your application using the ALB DNS name.

Additional Notes
Replace all <placeholders> with actual values like <cluster-name>, <region>, and <your-vpc-id>.
Ensure that your policy.json file is properly configured with the necessary permissions for managing ALBs.
If you need to configure an ingress resource, you can define it in the deploy.yaml->ingress file.
