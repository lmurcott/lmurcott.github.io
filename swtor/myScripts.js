function listVariations () {
    const theAccuracy = parseInt(document.getElementById("accuracy").value);
    const theAlacrity = parseInt(document.getElementById("alacrity").value);
    const theIRating = parseInt(document.getElementById("iRating").value);
    const theAugment = parseInt(document.getElementById("augment").value);
    const theStim = document.getElementById("stim").value;
    
    const hydeZeek = function () {
        const status = document.getElementById("hydeZeek").checked;
        if (status && theIRating < 615 && theIRating != 577){
            return true;
        }
    }

    const getImplantsStat = function (stat) {// "accuracy" "critical" "alacrity"
        const implantRating = parseInt(document.getElementById("implantRating").value);
        let rating = 0;

        for (let i = 0; i < 2; i++) {
            if (document.getElementById("implantStat" + i).value == stat) {
                rating += implantRating;
            }
        }

        return rating;
    }

    const getAllCombinations = function() {
        let accuracyC, alacrityC, accuracyStimC;
        let theCombinations = [];

        if (theAccuracy > 0 && theStim != "versatile") {//calculate stim accuracy
            accuracyStimC = statCombinations("accuracy", theAccuracy, true);
            accuracyStimC = isStimmed(accuracyStimC, "Yes");
        }

        if (theAccuracy > 0 && theStim != "proficient") {//calculate no stim accuracy
            accuracyC = statCombinations("accuracy", theAccuracy);
            accuracyC = isStimmed(accuracyC, "No");
        }

        if (theAlacrity > 0) {//generate alacrity
            alacrityC = statCombinations("alacrity", theAlacrity);
        }

        if (theAlacrity > 0 && theAccuracy > 0) {//Generate Both stats
            if (theStim != "versatile") {//with stim
                theCombinations = theCombinations.concat(combineStats(alacrityC, accuracyStimC));
            }
            if (theStim != "proficient") {//without stim
                theCombinations = theCombinations.concat(combineStats(alacrityC, accuracyC));
            }
            if (theCombinations.length < 1) {
                return undefined;
            }
            theCombinations = sortArray(theCombinations, 7);
        } else if (theAlacrity > 0) {
            theCombinations = sortArray(alacrityC, 2);
        } else if (theAccuracy > 0) {
            if (theStim != "versatile") {//with stim
                theCombinations = theCombinations.concat(accuracyStimC);
            }
            if (theStim != "proficient") {//without stim
                theCombinations = theCombinations.concat(accuracyC);
            }
            theCombinations = sortArray(theCombinations, 2);
        }
        return theCombinations;
    }

    const isStimmed = function (list, stimUsed) {//add accuracy stim note to accuracy only
        for(let i=0; i < list.length; i++) {
            list[i].push(stimUsed);
        }
        return list;
    }

    const combineStats = function (alacrity, accuracy) {
        let maxGear = 7;
        let mergedArray = [];

        if (!hydeZeek()) {
            maxGear = 8;
        }

        for (let a = 0; a < alacrity.length; a++) {
            for (let b = 0; b < accuracy.length; b++) {
                if (
                    (alacrity[a][1] + accuracy[b][1]) < 15 &&
                    (alacrity[a][0] + accuracy[b][0]) < maxGear
                    ) {
                        let theCombination = alacrity[a].concat(accuracy[b])
                        theCombination.push(alacrity[a][2] + accuracy[b][2]);//total stats in array
                        mergedArray.push(theCombination);
                        break;
                }
            }
        }

        return mergedArray;
    }

    const statCombinations = function(stat, target, stim = false) {

        let maxGear = 8;
        let minGear = 0;

        if (stat == "accuracy" && !hydeZeek()) {
            maxGear = 6;
        } else if (stat == "alacrity" && !hydeZeek()) {
            maxGear = 7;
            minGear = 1;
        }

        if (stim) {
            return generate((getImplantsStat(stat) + 264), target, maxGear, minGear, stim);
        } else {
            return generate(getImplantsStat(stat), target, maxGear, minGear);
        }
    }

    const generate = function(base, target, maxGear, minGear) {
        results = [];
        for (let g = minGear; g != maxGear; g++) {
            let total = base + (g * theIRating);
            for (let a = 0; a < 15; a++) {//find augments
                if ((total + (a * theAugment)) >= target) {
                    results.push([g, a, total + (a * theAugment)]);
                    break;
                }
            }
            if (total >= target) {
                break;
            }
        }
        /* not currently possible
        if (results.length < 1) {
            return undefined;
        }
        */
        return results;
    }

    const sortArray = function (theArray, column) {
        newArray = theArray;
        newArray.sort(function (a, b) {
                    return a[column] - b[column];
            });
        return newArray;
    }

    const drawTable = function(data) {
        let tblHTML = "<table>";

        if (theAccuracy > 1 && theAlacrity > 1) {
            tblHTML += "<tr><th>Alacrity Gear Count<br><span class='footnote'>[excluding implants]</span></th><th>Alacrity Augment Count</th><th>Accuracy Gear Count<br><span class='footnote'>[excluding implants]</span></th><th>Accuracy Augment Count</th><th>Proficient Stim Used?</th><th>Overcap Amount</th></tr>";
            for (let i = 0; i < data.length; i++ ) {
                tblHTML += "<tr>";
                tblHTML += "<td>" + data[i][0] + "</td>";
                tblHTML += "<td>" + data[i][1] + "</td>";
                tblHTML += "<td>" + data[i][3] + "</td>";
                tblHTML += "<td>" + data[i][4] + "</td>";
                tblHTML += "<td>" + data[i][6] + "</td>";
                tblHTML += "<td>" + (data[i][2] + data[i][5] - theAlacrity - theAccuracy) + "</td>";
                tblHTML += "<tr>";
            }
        } else if (theAlacrity > 1) {
            tblHTML += "<tr><th>Alacrity Gear Count<br><span class='footnote'>[excluding implants]</span></th><th>Alacrity Augment Count</th><th>Overcap Amount</th></tr>";
            for (let i = 0; i < data.length; i++ ) {
                tblHTML += "<tr>";
                tblHTML += "<td>" + data[i][0] + "</td>";
                tblHTML += "<td>" + data[i][1] + "</td>";
                tblHTML += "<td>" + (data[i][2] - theAlacrity) + "</td>";
                tblHTML += "<tr>";
            }
        } else if (theAccuracy > 1) {
            tblHTML += "<tr><th>Accuracy Gear Count<br><span class='footnote'>[excluding implants]</span></th><th>Accuracy Augment Count</th><th>Proficient Stim Used?</th><th>Overcap Amount</th></tr>";
            for (let i = 0; i < data.length; i++ ) {
                tblHTML += "<tr>";
                tblHTML += "<td>" + data[i][0] + "</td>";
                tblHTML += "<td>" + data[i][1] + "</td>";
                tblHTML += "<td>" + data[i][3] + "</td>";
                tblHTML += "<td>" + (data[i][2] - theAccuracy) + "</td>";
                tblHTML += "<tr>";
            }
        }

        tblHTML += "</table>";
        return tblHTML;
    }

    const draw = function(myCombinations) {
        let theHTML;

        if (myCombinations == undefined || myCombinations.length < 1) {
            theHTML = "No Combinations Available!!";
        } else {
            theHTML = drawTable(myCombinations);
        }
        
        document.getElementById("result").innerHTML = theHTML;
    }

    draw(getAllCombinations());
}