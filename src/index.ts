const log = console.log
interface Rule {
    args: [any]
    kind: string
    check: RuleCheck
    DefaultMessage :RuleDefaultMessage
}
interface RuleDefaultMessage {
    (name :string, value :any, args: [any]): string
}
interface RuleCheck {
    (value: any) :boolean;
}

const vdKind = {
    minLen: "vd-minLen"
}


class VD {
    constructor() {

    }
    check(ruleList :Rule[], name :string, value: any) :[/* pass */ boolean, /* message */ string] {
        let output :[boolean, string] = [true, ""]
        ruleList.some(function (rule: Rule) {
            let pass= rule.check(value)
            if (!pass) {
                let message = rule.DefaultMessage(name, value, rule.args)
                output = [pass, message]
                return true
            }
        })
        return output
    }
    minLen(len :number) :Rule {
     return {
         args: [len],
         kind: vdKind.minLen,
         DefaultMessage: function(name :string, value :any, arg: any) /* message */ :string {
             return `${name}不能小于${arg.toString()}`
         },
         check(value: any) /* pass */:boolean {
             let valueLen :number = 0
             switch (value.constructor) {
                 case String:
                     valueLen = value.length
                     break
                 case Number:
                     valueLen = String(value).length
                     break
                 case Array:
                     valueLen = value.length
                     break
                 default:
                     throw new Error("vd.minLen(value) value type must be string or number or array")
             }
             if (valueLen > len) {
                 return true
             }
             return false
         }
     }
    }
}

const vd = new VD()


log(vd.check([vd.minLen(2)], "姓名", "n")) // false, 姓名不能小于2
log(vd.check([vd.minLen(2)], "姓名", "nimoc")) // true, ""


export { vd }
