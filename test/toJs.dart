@JS()
library json2class;

import 'package:js/js.dart';
import 'package:json2class/json2class.dart';

@JS('json2dart')
external set _json2dart(String Function(String, String) f);

@JS('json2ts')
external set _json2ts(String Function(String, String) f);

String json2dart2(String className, String jsonStr) {
  return json2dart(className: className, jsonStr: jsonStr);
}

String json2ts2(String className, String jsonStr) {
  return json2ts(className: className, jsonStr: jsonStr);
}

void main() {
  _json2dart = allowInterop(json2dart2);
  _json2ts = allowInterop(json2ts2);
}
