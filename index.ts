import * as k8s from "@pulumi/kubernetes";
import * as rmq from "./rabbitmq-crd";

const service = new k8s.core.v1.Service("test-svc", {
  metadata: { name: "test-svc" },
  spec: {
    ports: [{ port: 80, targetPort: 80 }],
    selector: {
      app: "test-deployment",
    },
  },
});

const user = new rmq.rabbitmq.v1beta1.User("test-user", {
  metadata: { name: "test-user", namespace: "platform" },
  spec: {
    rabbitmqClusterReference: {
      name: "rabbitmq-cluster",
      namespace: "rabbitmq",
    },
  },
});

const perm = new rmq.rabbitmq.v1beta1.Permission("test-perm", {
  metadata: { name: "test-perm", namespace: "platform" },
  spec: {
    vhost: "/",
    user: user.status.username,
    permissions: {
      configure: ".*",
      write: ".*",
      read: ".*",
    },
    rabbitmqClusterReference: {
      name: "rabbitmq-cluster",
      namespace: "rabbitmq",
    },
  },
});

export const name = service.metadata.name;
export const username = user.metadata.name;

console.log("Deployment: ", service.status);
console.log("User: ", user.status);
console.log("Permission: ", perm.status);
