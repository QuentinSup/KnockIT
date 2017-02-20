/**
 * @fileOverview This file defines a simple xml to json converter.
 */
module kit.helpers {

	export class XmlConverter {
		public static ATTRIBUTES_KEY: string = "_attributes_";
		/**
		 * Converts XML to JSON.
		 */
		public static toJson(xml: Node): any {
			var attributes: any,
				childNodes: any,
				json: any;

			json = {};

			// Get the attributes
			switch (xml.nodeType) {
				case 1: // element
					if (xml.attributes.length > 0) {
						attributes = json[XmlConverter.ATTRIBUTES_KEY] = {};
						$.each(xml.attributes, function (index: number, nodeAttribute: Attr) {
							attributes[nodeAttribute.nodeName] = nodeAttribute.nodeValue;
						});
					} else if (xml.childNodes.length == 1 && xml.childNodes.item(0).nodeType == 3) {
						// Return directly the text
						return xml.childNodes.item(0).nodeValue;
					}
					break;
				case 3: // text
					json = xml.nodeValue;
					break;
			}

			// Get the child nodes
			if (xml.hasChildNodes()) {
				childNodes = json/*["childNodes"] = {}*/;
				$.each(xml.childNodes, function (index: number, childNode: Node) {
					var nodeName: string = childNode.nodeName;

					if (nodeName == "#text") {
						// Ignore empty nodes (spaces, new lines, etc)
						return;
					}

					if (typeof (childNodes[nodeName]) == "undefined") {
						childNodes[nodeName] = XmlConverter.toJson(childNode);
					} else {
						if (typeof (childNodes[nodeName].push) == "undefined") {
							var old = childNodes[nodeName];
							childNodes[nodeName] = [];
							childNodes[nodeName].push(old);
						}
						childNodes[nodeName].push(XmlConverter.toJson(childNode));
					}
				});
			}

			return json;
		}
	}
}