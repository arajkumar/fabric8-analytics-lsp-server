/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Dharmendra Patel 2020
 * Licensed under the Apache-2.0 License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver'
import { Range } from 'vscode-languageserver';

/* Package vulnerability data */
class Package {
    ecosystem: string;
    name: string;
    version: string;
    packageCount: number;
    vulnerabilityCount: number;
    advisoryCount: number;
    exploitCount: number;
    highestSeverity: string;
    recommendedVersion: string;
    range: Range;

    constructor(
        name: string, version: string, packageCount: number,
        vulnerabilityCount: number, advisoryCount: number,
        exploitCount: number, highestSeverity: string,
        recommendedVersion: string, range: Range) {
        this.name = name;
        this.version = version;
        this.packageCount = packageCount || 0;
        this.vulnerabilityCount = vulnerabilityCount || 0;
        this.advisoryCount = advisoryCount || 0;
        this.exploitCount = exploitCount || 0;
        this.highestSeverity = highestSeverity;
        this.recommendedVersion = recommendedVersion;
        this.range = range;
    }

    getDiagnostic(): Diagnostic {
        /* The diagnostic's severity. */
        let diagSeverity: any;

        if (this.vulnerabilityCount == 0 && this.advisoryCount > 0) {
            diagSeverity = DiagnosticSeverity.Information;
        } else {
            diagSeverity = DiagnosticSeverity.Error;
        }

        const recommendedVersion = this.recommendedVersion || "N/A";
        const exploitCount = this.exploitCount || "unavailable";
        var numberOfPackagesMsg = ""
        if (this.ecosystem == "golang") {
            numberOfPackagesMsg = `\nNumber of packages: ${this.packageCount}`;
        }
        const msg = `${this.name}: ${this.version}${numberOfPackagesMsg}
Known security vulnerability: ${this.vulnerabilityCount}
Security advisory: ${this.advisoryCount}
Exploits: ${exploitCount}
Highest severity: ${this.highestSeverity}
Recommendation: ${recommendedVersion}`;

        return {
            severity: diagSeverity,
            range: this.range,
            message: msg,
            source: '\nDependency Analytics Plugin [Powered by Snyk]',
        };
    }
}

export { Package };
