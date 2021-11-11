# Azure FlexibleMySQL using the native Azure Provider

This example deploys a FlexibleMySQL server on Azure.

## Deploying the App

To deploy your infrastructure, follow the below steps.

### Prerequisites

1. [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
2. [Install node.js](https://nodejs.org/en/download/)
3. [Configure Azure Credentials](https://www.pulumi.com/docs/intro/cloud-providers/azure/setup/)

### Steps

After cloning this repo, from this working directory, run these commands:

1. Create a new stack, which is an isolated deployment target for this example:

    ```bash
    $ pulumi stack init dev
    ```

1. Next, install the dependencies:

    ```bash
    $ npm install
    ```

1. Login to Azure CLI (you will be prompted to do this during deployment if you forget this step):

    ```bash
    $ az login
    ```

1. Set the Azure region location to use:
    
    ```
    $ pulumi config set azure-native:location eastus
    $ pulumi config set username resu
    $ pulumi config set --secret password drowssap
    ```

1. Stand up the cluster by invoking pulumi

    ```bash
    $ pulumi up
    ```

1. Check the server's fqdn address:

    ```bash
    $ pulumi stack output mysqlFqdn
    ```

1. From there, feel free to experiment. Simply making edits and running `pulumi up` will incrementally update your stack.

1. Once you've finished experimenting, tear down your stack's resources by destroying and removing it:

    ```bash
    $ pulumi destroy --yes
    $ pulumi stack rm --yes
    ```