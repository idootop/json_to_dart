import 'package:dart_style/dart_style.dart';

import 'model_generator.dart';

/// Convert JSON to Dart Classes
///
/// Support nullsafety perfectly.
String json2dart({
  required String className,
  required String jsonStr,
  bool format = true,
}) {
  final generator = ModelGenerator(className);
  try {
    final unsafeDartCode = generator.generateUnsafeDart(jsonStr).code;
    return format ? _format(unsafeDartCode) : unsafeDartCode;
  } on FormatException catch (e) {
    return e.message;
  }
}

String _format(String unsafeDartCode, {bool justFormate = false}) {
  var dartCode = '';
  try {
    dartCode = DartFormatter(pageWidth: 1000).format(unsafeDartCode);
  } on FormatterException catch (e) {
    final keywords = [];
    final suffix = r'$';
    for (var error in e.errors) {
      final keyword = RegExp(r"'(.*?)' can't be used as an identifie")
          .firstMatch(error.message)
          ?.group(1);
      if (!keywords.contains(keyword)) keywords.add(keyword);
    }
    if (justFormate) return unsafeDartCode;
    var code = unsafeDartCode;
    for (var keyword in keywords) {
      code = code.replaceAll('.$keyword', '.$keyword$suffix');
      code = code.replaceAll('$keyword;', '$keyword$suffix;');
      code = code.replaceAll('$keyword,', '$keyword$suffix,');
      code = code.replaceAll('$keyword ', '$keyword$suffix ');
      code = code.replaceAll('$suffix$suffix', '$suffix');
    }
    dartCode = _format(code, justFormate: true);
  }
  return dartCode;
}
