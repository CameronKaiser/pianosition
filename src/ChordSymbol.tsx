import { TonalKey           } from './TonalKey.tsx'
import { Note               } from './Note.tsx'
import { pitchClassSequence } from './Globals.tsx'
import { analyzeChord       } from './ChordAnalyzer.tsx'
import { AnalyzedChord      } from './ChordAnalyzer.tsx'

    type props = {
        notes: Note[]
        tonalKey : TonalKey
        bar: number;
        currentBar: number;
    }

    export function ChordSymbol({notes, tonalKey, bar, currentBar} : props) {

        if(notes.length == 0) {
            return;
        }

        let analyzedChord: AnalyzedChord = analyzeChord(notes, tonalKey);

        let symbol = analyzedChord.root.pitchClass;

        let naturalIndex = pitchClassSequence[analyzedChord.root.letterIndex];

    //  Get distance between chromaticIndex and naturalIndex using wraparound methodology, e.g.
    //  11 and 0 results in an alteration of -1 as in [8 9 10 11 0 1 etc.] 11 is one index behind
        let chromaticAlteration = analyzedChord.root.chromaticIndex - naturalIndex;
        if(chromaticAlteration > 6) {
            chromaticAlteration -= 12;
        } else if (chromaticAlteration < -6) {
            chromaticAlteration += 12;
        }

        let alterationText = "";
        switch(chromaticAlteration){
            case 1:
                alterationText = "♯";
                break;
    
            case 2: 
                alterationText = "x";
                break;
    
            case -1:
                alterationText = "♭";
                break;
    
            case -2: 
                alterationText = "♭♭";
        }

        let quality = "";
        switch(analyzedChord.thirdQuality){
            case "minor": 
                symbol = symbol.toLowerCase();
                break;

            case "diminished":
                quality = "dim";
                symbol = symbol.toLowerCase();
                if(analyzedChord.seventhQuality == "halfDiminished") {
                    quality = "m7♭5";
                }
                break;
                
            case "major": 
                if(analyzedChord.seventhQuality == "minor") {
                    quality = "7";
                }
                if(analyzedChord.seventhQuality == "major"){
                    quality = "maj7"
                }
                break;
    
            case "augmented": 
                quality = "aug";
        }

        if(analyzedChord.nature == "italianSixth" || analyzedChord.nature == "frenchSixth" || analyzedChord.nature == "germanSixth") {
            quality = "7"
        }

        let leftOffset = 75 * bar + 33 + tonalKey?.keySignatureOffset;

        let inversion = "";
        if(analyzedChord.root.pitchClass != analyzedChord.fundamental.pitchClass) {
            let naturalFundamentalIndex = pitchClassSequence[analyzedChord.fundamental.letterIndex];
            let chromaticAlteration = analyzedChord.fundamental.chromaticIndex - naturalFundamentalIndex;
            if(chromaticAlteration > 6) {
                chromaticAlteration -= 12;
            } else if (chromaticAlteration < -6) {
                chromaticAlteration += 12;
            }

            let fundamentalAlterationText = "";
            switch(chromaticAlteration){
                case 1:
                    fundamentalAlterationText = "♯";
                    break;
        
                case 2: 
                fundamentalAlterationText = "x";
                    break;
        
                case -1:
                    fundamentalAlterationText = "♭";
                    break;
        
                case -2: 
                    fundamentalAlterationText = "♭♭";
            }

            inversion = " / " + analyzedChord.fundamental.pitchClass + fundamentalAlterationText;
        }

        return(
            <div className="symbol" style={{left: leftOffset + 5}}>
                {symbol}
                {alterationText}
                <span style={{fontSize: 16}}>{quality}</span>
                {inversion}
            </div>
        )

    }