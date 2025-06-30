import {
  DefaultValueAccessor
} from "./chunk-H73JSO4K.js";
import {
  MASKITO_DEFAULT_ELEMENT_PREDICATE,
  MASKITO_DEFAULT_OPTIONS,
  Maskito,
  maskitoTransform
} from "./chunk-ODLNX5WC.js";
import "./chunk-MHVWG4J6.js";
import "./chunk-AKFTAZAO.js";
import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  Pipe,
  inject,
  setClassMetadata,
  ɵɵHostDirectivesFeature,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefinePipe
} from "./chunk-QXOIBFPJ.js";
import "./chunk-P6U2JBMQ.js";
import {
  __async
} from "./chunk-WDMUDEB6.js";

// node_modules/@maskito/angular/fesm2022/maskito-angular.mjs
var MaskitoDirective = class _MaskitoDirective {
  constructor() {
    this.elementRef = inject(ElementRef).nativeElement;
    this.ngZone = inject(NgZone);
    this.maskedElement = null;
    this.options = null;
    this.elementPredicate = MASKITO_DEFAULT_ELEMENT_PREDICATE;
    const accessor = inject(DefaultValueAccessor, {
      self: true,
      optional: true
    });
    if (accessor) {
      const original = accessor.writeValue.bind(accessor);
      accessor.writeValue = (value) => {
        original(this.options ? maskitoTransform(String(value ?? ""), this.options) : value);
      };
    }
  }
  ngOnChanges() {
    return __async(this, null, function* () {
      const {
        elementPredicate,
        options,
        maskedElement,
        elementRef,
        ngZone
      } = this;
      maskedElement?.destroy();
      if (!options) {
        return;
      }
      const predicateResult = yield elementPredicate(elementRef);
      if (this.elementPredicate !== elementPredicate || this.options !== options) {
        return;
      }
      ngZone.runOutsideAngular(() => {
        this.maskedElement = new Maskito(predicateResult, options);
      });
    });
  }
  ngOnDestroy() {
    this.maskedElement?.destroy();
  }
  static {
    this.ɵfac = function MaskitoDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MaskitoDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _MaskitoDirective,
      selectors: [["", "maskito", ""]],
      inputs: {
        options: [0, "maskito", "options"],
        elementPredicate: [0, "maskitoElement", "elementPredicate"]
      },
      features: [ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaskitoDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[maskito]"
    }]
  }], function() {
    return [];
  }, {
    options: [{
      type: Input,
      args: ["maskito"]
    }],
    elementPredicate: [{
      type: Input,
      args: ["maskitoElement"]
    }]
  });
})();
var MaskitoPipe = class _MaskitoPipe {
  transform(value, maskitoOptions) {
    return maskitoTransform(String(value ?? ""), maskitoOptions ?? MASKITO_DEFAULT_OPTIONS);
  }
  static {
    this.ɵfac = function MaskitoPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MaskitoPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "maskito",
      type: _MaskitoPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaskitoPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "maskito"
    }]
  }], null, null);
})();
var MaskitoPattern = class _MaskitoPattern {
  constructor() {
    this.maskitoDirective = inject(MaskitoDirective, {
      self: true
    });
  }
  set regExpStr(pattern) {
    this.maskitoDirective.options = {
      mask: typeof pattern === "string" ? new RegExp(`^${pattern}$`) : pattern
    };
    this.maskitoDirective.ngOnChanges();
  }
  static {
    this.ɵfac = function MaskitoPattern_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MaskitoPattern)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _MaskitoPattern,
      selectors: [["", "maskitoPattern", ""]],
      inputs: {
        regExpStr: [0, "maskitoPattern", "regExpStr"]
      },
      features: [ɵɵHostDirectivesFeature([MaskitoDirective])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaskitoPattern, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[maskitoPattern]",
      hostDirectives: [MaskitoDirective]
    }]
  }], null, {
    regExpStr: [{
      type: Input,
      args: ["maskitoPattern"]
    }]
  });
})();
export {
  MaskitoDirective,
  MaskitoPattern,
  MaskitoPipe
};
//# sourceMappingURL=@maskito_angular.js.map
