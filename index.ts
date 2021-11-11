import * as pulumi from "@pulumi/pulumi"
import * as random from "@pulumi/random"
import * as resources from "@pulumi/azure-native/resources"
import * as network from "@pulumi/azure-native/network"
import { mysql } from "@pulumi/azure"

const config = new pulumi.Config()

const username = config.get("username") || "pulumiadmin"
const password = config.get("password") || new random.RandomPassword("pw", {
    length: 20,
    special: true,
}).result

/******/
/* RG */
/******/

export const resourceGroup = new resources.ResourceGroup("rg", {
    location: 'EastUS'
})

/**************/
/* NETWORKING */
/**************/
export const virtualNetwork = new network.VirtualNetwork("vnet", {
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    }
});

const dataSubnet = new network.Subnet("data", {
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: virtualNetwork.name,
    addressPrefix: "10.0.1.0/24",
    serviceEndpoints: [{
        service: "Microsoft.Storage"
    }],
    delegations: [{
        name: "fs",
        serviceName: "Microsoft.DBforMySQL/flexibleServers",
    }],
});

const privateZone = new network.PrivateZone("privateZone", {
    resourceGroupName: resourceGroup.name,
    privateZoneName: "privatelink.mysql.database.azure.com",
    location: "Global",
});

const virtualNetworkLink = new network.VirtualNetworkLink("vnetLink", {
    location: "Global",
    privateZoneName: privateZone.name,
    registrationEnabled: false,
    resourceGroupName: resourceGroup.name,
    virtualNetwork: {
        id: virtualNetwork.id,
    },
    virtualNetworkLinkName: "virtualNetworkLink1",
});

/*****************/
/* FlexibleMySQL */
/*****************/
const mysqlFlexibleServer = new mysql.FlexibleServer("mysql", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    administratorLogin: username,
    administratorPassword: password,
    backupRetentionDays: 7,
    delegatedSubnetId: dataSubnet.id,
    privateDnsZoneId: privateZone.id,
    skuName: "B_Standard_B1ms",
}, {
    dependsOn: [privateZone, virtualNetworkLink],
});