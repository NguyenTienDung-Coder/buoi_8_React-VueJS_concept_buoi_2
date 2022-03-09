const divTag = document.getElementById("react-id");

// ReactDOM.render(React.createElement(
//     'button',
//     null,
//     'click me by reactjs'
// ), divTag)
const buttonName = <span>button by span</span>;
const name="button 4"
class Component extends React.Component {
    constructor() {
        super();
        this.state= {age: 26, name: "button"};
    }

    componentDidMount() {
        console.log("log by componentDidMount")
    }
    componentDidUpdate() {
        console.log("updating....");
    }
    componentWillUnmount() {
        console.log("detroying....");
    }
    render() {
        return (
            <div>
            <button >{this.state.name}</button>
            {this.state.age}
            <button onClick={() => {
                this.setState({name: "button 2", age: 0})
            }}>change name button</button>
            <div> area Component</div>
            {this.state.name > 0 && <Component2 propName={this.state.name} />}
            </div>
        )
    }
}

const User = (props) => {
    const [age,setAge] = React.useState(props.age)
    return (
        <div key={props.name}>name: {props.name}, age: <input value={age}
        
        /> {props.age}<span></span></div>
    )
}
function Component2(props) {
    const [users, setUsers] = React.useState([
        {name: "user 1", age: 1},
        {name: "user 2", age: 2},
        {name: "user 3", age: 3}
    ]);

    React.useEffect(() => {
        console.log("log by useEffect")
        console.log(props.propsName);
        return () => {
            console.log("detroy in Component2")
        }
    })
    return (
        <div>
            here is component2
            <span>{users.map((user,index) => {
                return (
                    <User key={user.name} name={user.name} age={user.age} />
                )
            })}</span>
            <button
            onClick={() => {
                users.pop();
                users.push({name:"user 4", age:4})
                setUsers([...users])
            }}
            >add user</button>
        </div>
    )
}

const Member = (props) => {
    const {name, age, handleTranfer, handleEdit, renderExtend} = props;
    return <div>
        <span>name: {name}</span> -- <span>age: {age}</span>
        <button onClick={() => handleTranfer()}>tranfer</button>
        <button onClick={() => handleEdit()}>edit</button>
        {renderExtend && renderExtend()}
    </div>
}
const INIT_DATA = {
    name: "",
    age: "",
    classType: "react"
}
const TranferMember = () => {

    const [reactMembers, setReactMember] = React.useState(() => {
        const members = JSON.parse(localStorage.getItem("members"));
        console.log(members);
        if (!members || !members.reactMembers) {
            return []
        }
        return members.reactMembers
    });
    // useState có thể nhận vào 1 function, giá trị mà function này return về sẽ dùng để khởi tạo state
   
    const [javaMembers, setJavaMember] = React.useState(() => {
        const members = JSON.parse(localStorage.getItem("members"));
        if (!members || !members.javaMembers) {
            return []
        }
        return members.javaMembers
    });
    const saveData = () => {
        localStorage.setItem("members", JSON.stringify({
            javaMembers,
            reactMembers,
        }))
    }
    React.useEffect(() => {
        if (javaMembers.length ===0) {
            alert("WARNING: java class is empty now")
        } else if (reactMembers.length === 0) {
            alert("WARNING: react class is empty now")
        }
        saveData();
    } , [reactMembers.length, javaMembers.length])

    // React.useEffect(() => {
    //     return () => {
    //         console.log("destroy")
    //         localStorage.setItem("members", JSON.stringify({
    //             javaMembers,
    //             reactMembers,
    //         }))
    //     }
    // }, [])
    
    const tranferReactToJavaMember = (index) => {
        const el = reactMembers[index];
        reactMembers.splice(index, 1);
        javaMembers.push(el);
        setReactMember([...reactMembers]);
        setJavaMember([...javaMembers]);
    }
    const tranferJavaToReactMember = (index) => {
        const el = javaMembers[index];
        javaMembers.splice(index, 1);
        reactMembers.push(el);
        setReactMember([...reactMembers]);
        setJavaMember([...javaMembers]);
    }
    
    const [formData, setFormData] = React.useState(INIT_DATA)
    
    const handleInput = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        })
    }

    const handleSubmit = () => {
        if (formData.classType === 'react') {
            reactMembers.push(formData);
            setReactMember([...reactMembers])
        } else {
            javaMembers.push(formData)
            setJavaMember([...javaMembers])
        }
        setFormData(INIT_DATA)
    }
    

    const fillReact = (user, index) => {
        setFormData({
            ...user,
            index: index,
            classType:'react'
        })
    }
    
    const fillJava = (user, index) =>{
        setFormData({
            ...user,
            index: index,
            classType:'java'
        })
    }     

    return (
        <div>
        <h1>list member of React class</h1>
        {reactMembers.length > 0 ? reactMembers.map((user, index) => {
            return <Member name={user.name} age={user.age}
            key={index}
            handleTranfer={() => tranferReactToJavaMember(index)} 
            handleEdit={() => {fillReact(user, index)}}

            //   renderExtend={() => <span>hello by react</span> 
            />
        }) : "empty class"}
        <h1>list member of Java class</h1>
        {javaMembers.length > 0 ?javaMembers.map((user,index) => {
            return <Member name={user.name} age={user.age}
            key={index}
            handleTranfer={() => tranferJavaToReactMember(index)}
            handleEdit={() => {fillJava(user, index)}}

            //   renderExtend={() => <span>hello by java</span>}/>

             />
        }) : "empty class" }
        <h1>add member</h1>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                // e.preventDefault() dùng để bỏ qua sự kiện mặc định của event của 1 thẻ html nào đó như thẻ form, a
                handleSubmit();
            }}
            // action="/api"
            // method="post"
            
        >
            <label>name</label>
            <input name="name" value={formData.name}
                    onChange={(e) => handleInput(e)}>
            </input>
            {" --- "}
            <label>age</label>
            <input value={formData.age} name="age"
                onChange={(e) => handleInput(e)}
            >
            </input>

            <select name="classType" onChange={(e) => handleInput(e)}
                value={formData.classType}>
                <option value="react">React</option>
                <option value="java">Java</option>
            </select>
            {/* <button >submit</button> */}
            <button>update</button>
            {/* checkme<input type="checkbox" name="testCheckbox" /> */}
        </form>
        </div>
    )

}




// const Test = () => {
//     const [off, setOff] = React.useState();

//     return <div>

//     {!off && <TranferMember />}
//     <button onClick={() => setOff(!off)}>change</button>
//     </div>
// }
// props: {name: "button 3"}
ReactDOM.render(<div>
    <TranferMember />
    </div>, divTag);







