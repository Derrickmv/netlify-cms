import { fromJS } from 'immutable';
import { applyDefaults, validateConfig } from '../config';

describe('config', () => {
  describe('applyDefaults', () => {
    it('should set publish_mode if not set', () => {
      const config = fromJS({
        foo: 'bar',
        media_folder: 'path/to/media',
        public_folder: '/path/to/media',
      });
      expect(
        applyDefaults(config)
      ).toEqual(
        config.set('publish_mode', 'simple')
      );
    });

    it('should set publish_mode from config', () => {
      const config = fromJS({
        foo: 'bar',
        publish_mode: 'complex',
        media_folder: 'path/to/media',
        public_folder: '/path/to/media',
      });
      expect(
        applyDefaults(config)
      ).toEqual(
        config
      );
    });

    it('should set public_folder based on media_folder if not set', () => {
      expect(applyDefaults(fromJS({
        foo: 'bar',
        media_folder: 'path/to/media',
      }))).toEqual(fromJS({
        foo: 'bar',
        publish_mode: 'simple',
        media_folder: 'path/to/media',
        public_folder: '/path/to/media',
      }));
    });

    it('should not overwrite public_folder if set', () => {
      expect(applyDefaults(fromJS({
        foo: 'bar',
        media_folder: 'path/to/media',
        public_folder: '/publib/path',
      }))).toEqual(fromJS({
        foo: 'bar',
        publish_mode: 'simple',
        media_folder: 'path/to/media',
        public_folder: '/publib/path',
      }));
    });
  });

  describe('validateConfig', () => {
    it('should return the config if no errors', () => {
      const config = fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: 'baz', collections: [{}] });
      expect(
        validateConfig(config)
      ).toEqual(config);
    });

    it('should throw if backend is not defined in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar' }));
      }).toThrowError();
    });

    it('should throw if backend name is not defined in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: {} }));
      }).toThrowError();
    });

    it('should throw if backend name is not a string in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: { } } }));
      }).toThrowError();
    });

    it('should throw if media_folder is not defined in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' } }));
      }).toThrowError();
    });

    it('should throw if media_folder is not a string in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: {} }));
      }).toThrowError();
    });

    it('should throw if collections is not defined in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: 'baz' }));
      }).toThrowError();
    });

    it('should throw if collections not an array in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: 'baz', collections: {} }));
      }).toThrowError();
    });

    it('should throw if collections is an empty array in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: 'baz', collections: [] }));
      }).toThrowError();
    });

    it('should throw if collections is an array with a single null element in config', () => {
      expect(() => {
        validateConfig(fromJS({ foo: 'bar', backend: { name: 'bar' }, media_folder: 'baz', collections: [null] }));
      }).toThrowError();
    });
  });
});