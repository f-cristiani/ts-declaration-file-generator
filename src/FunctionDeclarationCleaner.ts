import { FunctionDeclaration } from "./TypescriptDeclaration/FunctionDeclaration";

export class FunctionDeclarationCleaner {
	functionDeclarations: FunctionDeclaration[] = [];

	clean(functionDeclarations: FunctionDeclaration[]) : FunctionDeclaration[] {
		this.functionDeclarations = functionDeclarations;

		this.combineReturnValues();

		return this.functionDeclarations;
	}

	private combineReturnValues() {
		let uniqueDeclarationNameAndArguments: { [id: string]: FunctionDeclaration } = {};

		this.functionDeclarations.forEach(declaration => {
			let serializedDeclaration = declaration.name + "__" + JSON.stringify(declaration.getArguments());

			if (!(serializedDeclaration in uniqueDeclarationNameAndArguments)) {
				uniqueDeclarationNameAndArguments[serializedDeclaration] = declaration;
			} else {
				let d = uniqueDeclarationNameAndArguments[serializedDeclaration];
				declaration.getReturnTypeOfs().forEach(returnTypeOf => {
					d.addReturnTypeOf(returnTypeOf);
				});
			}
		});

		let declarationWithCombinedReturnValues : FunctionDeclaration[] = [];

		for (const serializedDeclaration in uniqueDeclarationNameAndArguments) {
			if (uniqueDeclarationNameAndArguments.hasOwnProperty(serializedDeclaration)) {
				declarationWithCombinedReturnValues.push(uniqueDeclarationNameAndArguments[serializedDeclaration]);
			}
		}

		this.functionDeclarations = declarationWithCombinedReturnValues;
	}
}