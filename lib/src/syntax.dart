import 'package:collection/collection.dart' show IterableExtension;
import 'package:json_ast/json_ast.dart' show Node;
import 'helpers.dart';

const String emptyListWarn = 'list is empty';
const String ambiguousListWarn = 'list is ambiguous';
const String ambiguousTypeWarn = 'type is ambiguous';

bool isClass(TypeDefinition? typeDef) =>
    typeDef == null ? false : !typeDef.isPrimitive && typeDef.name != 'List';

String defaultFieldValue(
  TypeDefinition? typeDef, {
  String leading = ' ?? ',
  String trim = '!',
}) {
  final type = typeDef?.name;
  if (isClass(typeDef)) {
    return trim == '!' ? '$leading${typeDef?.name}()' : trim;
  }
  switch (type) {
    case 'List':
      return '$leading[]';
    case 'int':
      return '${leading}0';
    case 'double':
      return '${leading}0.0';
    case 'bool':
      return '${leading}false';
    case 'String':
      return "$leading''";
    default:
      return trim;
  }
}

class Warning {
  final String warning;
  final String path;

  Warning(this.warning, this.path);
}

Warning newEmptyListWarn(String path) {
  return Warning(emptyListWarn, path);
}

Warning newAmbiguousListWarn(String path) {
  return Warning(ambiguousListWarn, path);
}

Warning newAmbiguousType(String path) {
  return Warning(ambiguousTypeWarn, path);
}

class WithWarning<T> {
  final T result;
  final List<Warning> warnings;

  WithWarning(this.result, this.warnings);
}

class TypeDefinition {
  String? name;
  String? subtype;
  bool? isAmbiguous = false;
  bool _isPrimitive = false;

  factory TypeDefinition.fromDynamic(dynamic obj, Node? astNode) {
    bool isAmbiguous = false;
    final type = getTypeName(obj);
    if (type == 'List') {
      List<dynamic> list = obj;
      String elemType;
      if (list.length > 0) {
        elemType = getTypeName(list[0]);
        for (dynamic listVal in list) {
          if (elemType != getTypeName(listVal)) {
            isAmbiguous = true;
            break;
          }
        }
      } else {
        // when array is empty insert Null just to warn the user
        elemType = "Null";
      }
      return TypeDefinition(type,
          astNode: astNode, subtype: elemType, isAmbiguous: isAmbiguous);
    }
    return TypeDefinition(type, astNode: astNode, isAmbiguous: isAmbiguous);
  }

  TypeDefinition(this.name, {this.subtype, this.isAmbiguous, Node? astNode}) {
    if (subtype == null) {
      _isPrimitive = isPrimitiveType(this.name);
      if (this.name == 'int' && isASTLiteralDouble(astNode)) {
        this.name = 'double';
      }
    } else {
      _isPrimitive = isPrimitiveType('$name<$subtype>');
    }
    if (isAmbiguous == null) {
      isAmbiguous = false;
    }
  }

  bool operator ==(other) {
    if (other is TypeDefinition) {
      TypeDefinition otherTypeDef = other;
      return this.name == otherTypeDef.name &&
          this.subtype == otherTypeDef.subtype &&
          this.isAmbiguous == otherTypeDef.isAmbiguous &&
          this._isPrimitive == otherTypeDef._isPrimitive;
    }
    return false;
  }

  bool get isPrimitive => _isPrimitive;

  bool get isPrimitiveList => _isPrimitive && name == 'List';

  String _buildParseClass(String expression) {
    final properType = subtype ?? name;
    return '$properType.fromJson($expression)';
  }

  String _buildToJsonClass(String expression, {bool notNull = true}) {
    return '$expression${notNull ? '' : '?'}.toJson()';
  }

  String jsonParseExpression(String key, bool privateField) {
    final jsonKey = "json['$key']";
    final fieldKey =
        fixFieldName(key, typeDef: this, privateField: privateField);
    if (isPrimitive) {
      if (name == 'List') {
        return '$fieldKey : ($jsonKey ?? []).map<$subtype>((e)=> e as $subtype).toList(),';
      }
      return '$fieldKey : $jsonKey,';
    } else if (name == 'List') {
      // list of class
      return '$fieldKey : ($jsonKey ?? []).map<$subtype>((e)=> $subtype.fromJson(e)).toList(),';
    } else {
      // class
      return '$fieldKey : ${_buildParseClass('$jsonKey ?? {}')},';
    }
  }

  String toJsonExpression(String key, bool privateField) {
    final fieldKey =
        fixFieldName(key, typeDef: this, privateField: privateField);
    final thisKey = '$fieldKey';
    if (isPrimitive) {
      return "'$key' : $thisKey,";
    } else if (name == 'List') {
      // class list
      return "'$key' : $thisKey.map((e) => ${_buildToJsonClass('e', notNull: true)}).toList(),";
    } else {
      // class
      return "'$key' : ${_buildToJsonClass(thisKey)},";
    }
  }
}

class Dependency {
  String name;
  final TypeDefinition typeDef;

  Dependency(this.name, this.typeDef);

  String get className => camelCase(name);
}

class ClassDefinition {
  final String _name;
  final bool _privateFields;
  final Map<String, TypeDefinition> fields = Map<String, TypeDefinition>();

  String get name => _name;
  bool get privateFields => _privateFields;

  List<Dependency> get dependencies {
    final dependenciesList = <Dependency>[];
    final keys = fields.keys;
    keys.forEach((k) {
      final f = fields[k]!;
      if (!f.isPrimitive) {
        dependenciesList.add(Dependency(k, f));
      }
    });
    return dependenciesList;
  }

  ClassDefinition(this._name, [this._privateFields = false]);

  bool operator ==(other) {
    if (other is ClassDefinition) {
      var otherClassDef = other;
      return isSubsetOf(otherClassDef) && otherClassDef.isSubsetOf(this);
    }
    return false;
  }

  bool isSubsetOf(ClassDefinition other) {
    final keys = fields.keys.toList();
    final len = keys.length;
    for (int i = 0; i < len; i++) {
      TypeDefinition? otherTypeDef = other.fields[keys[i]];
      if (otherTypeDef != null) {
        TypeDefinition? typeDef = this.fields[keys[i]];
        if (typeDef != otherTypeDef) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  hasField(TypeDefinition otherField) {
    return fields.keys.firstWhereOrNull((k) => fields[k] == otherField) != null;
  }

  addField(String name, TypeDefinition typeDef) {
    fields[name] = typeDef;
  }

  void _addTypeDef(TypeDefinition typeDef, StringBuffer sb) {
    sb.write('${typeDef.name}${isClass(typeDef) ? '?' : ''}');
    if (typeDef.subtype != null) {
      sb.write('<${typeDef.subtype}>');
    }
  }

  String getTypeDef(TypeDefinition? typeDef) {
    if (typeDef?.subtype != null) {
      return '${typeDef?.name}<${typeDef?.subtype}>';
    }
    return '${typeDef?.name}';
  }

  String get _fieldList {
    return fields.keys.map((key) {
      final typeDef = fields[key]!;
      final fieldName =
          fixFieldName(key, typeDef: typeDef, privateField: privateFields);
      final type = getTypeDef(typeDef);
      return '\t late $type $fieldName;';
    }).join('\n');
  }

  String get defaultClassFieldValue {
    final classFieldsDefaultValues = fields.keys.map((e) {
      final key = e;
      final typeDef = fields[key];
      final fieldName =
          fixFieldName(key, typeDef: typeDef, privateField: privateFields);
      return '\t\tthis.$fieldName = $fieldName${defaultFieldValue(typeDef)};';
    }).toList();
    return classFieldsDefaultValues.join('\n');
  }

  String get _gettersSetters {
    return fields.keys.map((key) {
      final f = fields[key]!;
      final publicFieldName =
          fixFieldName(key, typeDef: f, privateField: false);
      final privateFieldName =
          fixFieldName(key, typeDef: f, privateField: true);
      final sb = StringBuffer();
      sb.write('\t');
      _addTypeDef(f, sb);
      sb.write(
          ' get $publicFieldName => $privateFieldName;\n\tset $publicFieldName(');
      _addTypeDef(f, sb);
      sb.write(' $publicFieldName) => $privateFieldName = $publicFieldName;');
      return sb.toString();
    }).join('\n');
  }

  String get _defaultPrivateConstructor {
    final sb = StringBuffer();
    sb.write('\t$name({');
    var i = 0;
    var len = fields.keys.length - 1;
    fields.keys.forEach((key) {
      final f = fields[key]!;
      final publicFieldName =
          fixFieldName(key, typeDef: f, privateField: false);
      _addTypeDef(f, sb);
      sb.write(' $publicFieldName');
      if (i != len) {
        sb.write(', ');
      }
      i++;
    });
    sb.write('}) {\n');
    fields.keys.forEach((key) {
      final f = fields[key];
      final publicFieldName =
          fixFieldName(key, typeDef: f, privateField: false);
      final privateFieldName =
          fixFieldName(key, typeDef: f, privateField: true);
      sb.write('this.$privateFieldName = $publicFieldName;\n');
    });
    sb.write('}');
    return sb.toString();
  }

  String get _defaultConstructor {
    final sb = StringBuffer();
    sb.write('\t$name({\n');
    fields.keys.forEach((key) {
      final typeDef = fields[key];
      final fieldName =
          fixFieldName(key, typeDef: typeDef, privateField: privateFields);
      final type = getTypeDef(typeDef);
      sb.write('\t\t$type? $fieldName,\n');
    });
    sb.write('\t}) {\n$defaultClassFieldValue\n\t}');
    return sb.toString();
  }

  String get _jsonParseFunc {
    final sb = StringBuffer();
    sb.write('\tfactory $name');
    sb.write('.fromJson(Map<String, dynamic> json) => $name(\n');
    fields.keys.forEach((k) {
      sb.write('\t\t${fields[k]!.jsonParseExpression(k, privateFields)}\n');
    });
    sb.write('\t);');
    return sb.toString();
  }

  String get _jsonGenFunc {
    final sb = StringBuffer();
    sb.write('\tMap<String, dynamic> toJson() => {\n');
    fields.keys.forEach((k) {
      sb.write('\t\t${fields[k]!.toJsonExpression(k, privateFields)}\n');
    });
    sb.write('\t};');
    return sb.toString();
  }

  String toString() {
    if (privateFields) {
      return 'class $name {\n$_fieldList\n\n$_defaultPrivateConstructor\n\n$_gettersSetters\n\n$_jsonParseFunc\n\n$_jsonGenFunc\n}\n';
    } else {
      return 'class $name {\n$_fieldList\n\n$_defaultConstructor\n\n$_jsonParseFunc\n\n$_jsonGenFunc\n}\n';
    }
  }
}
