import { FsLightboxMock } from "../../../__mocks__/components/fsLightboxMock";
import { StageSourceHoldersTransformer } from "../../../../src/core/Transforms/StageSourceHoldersTransformer";
import { StageSources } from "../../../../src/core/Stage/StageSources";


describe('current source transforming', () => {
    const fsLightboxMock = new FsLightboxMock();
    fsLightboxMock.instantiateFsLightbox();
    fsLightboxMock.setAllSourceHoldersToDivs();
    const fsLightbox = fsLightboxMock.getFsLightbox();

    it('should transform current source to (0,0)', () => {
        fsLightbox.state.slide = 1;
        expect(fsLightbox.elements.sourceHolders[0].current.style.transform).toEqual("");
        // we transform to zero on construct because there is always current source
        new StageSourceHoldersTransformer(fsLightbox);
        expect(fsLightbox.elements.sourceHolders[0].current.style.transform).toEqual("translate(0,0)");
    });
});

let stageSourcesIndexes;
const fsLightboxMock = new FsLightboxMock();
fsLightboxMock.instantiateFsLightbox();
fsLightboxMock.setAllSourceHoldersToDivs();
const fsLightbox = fsLightboxMock.getFsLightbox();
const stageSourceHoldersTransformer = new StageSourceHoldersTransformer(fsLightbox);
const stageSources = new StageSources(fsLightbox);
stageSourcesIndexes = stageSources.getAllStageIndexes();

const setUpNewSourceHoldersToClearTransforms = () => {
    fsLightboxMock.setAllSourceHoldersToDivs();
};

describe('without timeout transforming', () => {
    beforeEach(() => {
        setUpNewSourceHoldersToClearTransforms();
        stageSourceHoldersTransformer.withoutTimeout();
    });

    it('should transform previous source to negative value without timeout', () => {
        expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.previous].current.style.transform)
            .toEqual('translate(' + (-fsLightbox.sourcesData.slideDistance * global.window.innerWidth) + 'px,0)');
    });

    it('should transform next source to positive value without timeout', () => {
        expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.next].current.style.transform)
            .toEqual('translate(' + (fsLightbox.sourcesData.slideDistance * global.window.innerWidth) + 'px,0)');
    });
});


describe('with timeout transforming', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        setUpNewSourceHoldersToClearTransforms();
        stageSourceHoldersTransformer.withTimeout();
    });

    describe('not calling transform due to timer doesnt stopped', () => {
        it('should not transform previous source', () => {
            expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.previous].current.style.transform)
                .toEqual("");
        });

        it('should not transform next source', () => {
            expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.next].current.style.transform)
                .toEqual("");
        });
    });

    describe('calling transform after timers end',() => {
        beforeEach(() => {
            jest.runAllTimers();
        });

        it('should transform previous source to negative value', () => {
            jest.runAllTimers();
            expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.previous].current.style.transform)
                .toEqual('translate(' + (-fsLightbox.sourcesData.slideDistance * global.window.innerWidth) + 'px,0)');
        });

        it('should transform next source to positive value', () => {
            jest.runAllTimers();
            expect(fsLightbox.elements.sourceHolders[stageSourcesIndexes.next].current.style.transform)
                .toEqual('translate(' + (fsLightbox.sourcesData.slideDistance * global.window.innerWidth) + 'px,0)');
        });
    });
});