import React from 'react';
import { FsLightboxMock } from "../../../__mocks__/components/fsLightboxMock";
import { mount } from "enzyme";
import Image from "../../../../src/components/sources/properSources/Image";
import { SourceSizeAdjuster } from "../../../../src/core/Source/SourceSizeAdjuster";
import { testSourceDimensions } from "../../../schemas/testVariables";
import { getDescreasedDimensionValue, mountImageForFsLightboxInstance } from "../../../schemas/testFunctions";

describe('SourceSizeChange', () => {
    const fsLightboxMock = new FsLightboxMock();
    const fsLightboxInstance = fsLightboxMock.getInstance();

    describe('setIndex', () => {
        const sourceSizeAdjuster = new SourceSizeAdjuster(fsLightboxInstance);
        const mockImg = document.createElement('img');
        fsLightboxInstance.elements.sources[0].current = mockImg;
        fsLightboxInstance.sourceDimensions[0] = testSourceDimensions;
        sourceSizeAdjuster.setIndex(0);

        it('should set up index', () => {
            expect(sourceSizeAdjuster.index).toEqual(0);
        });

        it('should set up source width', () => {
            expect(sourceSizeAdjuster.sourceWidth).toEqual(testSourceDimensions.width);
        });

        it('should set up source height', () => {
            expect(sourceSizeAdjuster.sourceHeight).toEqual(testSourceDimensions.height);
        });

        it('should set up dimension ratio', () => {
            expect(sourceSizeAdjuster.ratio).toEqual(testSourceDimensions.width / testSourceDimensions.height);
        })
    });

    describe('updateSource', () => {
        const sourceSizeAdjuster = new SourceSizeAdjuster(fsLightboxInstance);
        const mockImg = document.createElement('img');
        fsLightboxInstance.elements.sources[0].current = mockImg;
        sourceSizeAdjuster.setIndex(0);
        sourceSizeAdjuster.updateSource();

        it('should set up element', () => {
            expect(sourceSizeAdjuster.element).toEqual(mockImg);
        });
    });

    describe('it should adjust source size when ...', () => {
        const sourceSizeAdjuster = new SourceSizeAdjuster(fsLightboxInstance);
        mountImageForFsLightboxInstance(fsLightboxInstance);
        fsLightboxInstance.sourceDimensions[0] = testSourceDimensions;
        sourceSizeAdjuster.setIndex(0);
        sourceSizeAdjuster.updateSource();
        const image = fsLightboxInstance.elements.sources[0].current;

        test('source width > window width & source height > window height', () => {
            global.window.innerWidth = 1500;
            global.window.innerHeight = 1400;
            fsLightboxInstance.onResize.saveMaxSourcesDimensions();
            sourceSizeAdjuster.adjustSourceSize();
            expect(parseInt(image.style.width)).toEqual(getDescreasedDimensionValue(1400));
            expect(parseInt(image.style.height)).toEqual(getDescreasedDimensionValue(1400));
        });


        test('source width > window width & source height < window height', () => {
            global.window.innerWidth = 1500;
            global.window.innerHeight = 2500;
            fsLightboxInstance.onResize.saveMaxSourcesDimensions();
            sourceSizeAdjuster.adjustSourceSize();
            expect(parseInt(image.style.width)).toEqual(getDescreasedDimensionValue(1500));
            expect(parseInt(image.style.height)).toEqual(getDescreasedDimensionValue(1500));
        });


        test('source width < window width & source height > window height', () => {
            global.window.innerWidth = 2500;
            global.window.innerHeight = 1500;
            fsLightboxInstance.onResize.saveMaxSourcesDimensions();
            sourceSizeAdjuster.adjustSourceSize();
            expect(parseInt(image.style.width)).toEqual(getDescreasedDimensionValue(1500));
            expect(parseInt(image.style.height)).toEqual(getDescreasedDimensionValue(1500));
        });


        test('source width < window width & source height < window height', () => {
            global.window.innerWidth = 2500;
            global.window.innerHeight = 2400;
            fsLightboxInstance.onResize.saveMaxSourcesDimensions();
            sourceSizeAdjuster.adjustSourceSize();
            expect(parseInt(image.style.width)).toEqual(2000);
            expect(parseInt(image.style.height)).toEqual(2000);
        });
    });
});