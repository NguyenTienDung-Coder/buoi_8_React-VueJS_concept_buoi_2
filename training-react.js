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

const SORT = {
    NO: 0,
    UP: 1,
    DOWN: 2,
}
const useCount =() => {
    const [count, setCount] = React.useState(1);
    const increaseCount = () => setCount(count+1)
    return {
        count, 
        increaseCount
    }
}
const Member = (props) => {
    const {name, age, handleTranfer, renderExtend, handleEdit, handleDelete} = props;
    return <div>
        <span>name: {name}</span> -<span>age: {age}</span>
        <button onClick={() => handleTranfer()}>tranfer</button>
        <button onClick={() => handleEdit()}>edit</button>
        <button onClick={() => handleDelete()}>Delete</button>
        {renderExtend && renderExtend()}
    </div>
}
const INIT_DATA = {
    name: "",
    age: "",
    classType: "react"
}

const CountContext = React.createContext();

const App = () => {
    const {count, increaseCount} = useCount()
    return (
        <CountContext.Provider value={{
            count,
            increaseCount,
        }}>
            <TranferMember></TranferMember>
        </CountContext.Provider>
        

        
    )
    
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
    const context = React.useContext(CountContext);
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
       if (formData.isEdit) {
            const {orginClassType, index} = formData;
            if (orginClassType !== formData.classType) {
                if (formData.classType === 'react') {
                    javaMembers.splice(index, 1);
                    setJavaMember([...javaMembers]);
                    reactMembers.push(formData)
                    setReactMember([...reactMembers])
                } else {
                    reactMembers.splice(index, 1);
                    setReactMember([...reactMembers]);
                    javaMembers.push(formData)
                    setJavaMember([...javaMembers])
                }
            } else {
                if (formData.classType === 'react') {
                    reactMembers[index] = formData;
                    setReactMember([...reactMembers])
                } else {
                    javaMembers[index] = formData;
                    setJavaMember([...javaMembers])
                }
            }
       } else {
            if (formData.classType === 'react') {
                reactMembers.push(formData);
                setReactMember([...reactMembers])
            } else {
                javaMembers.push(formData)
                setJavaMember([...javaMembers])
            }
       }
       setFormData(INIT_DATA)

       
        
   }
   const [searchName, setSearchName] = React.useState("");
   const [sortAge, setSortAge] = React.useState(SORT.NO);

   const getUsers = (list) => {
       console.log("getting users from: ", list);
       let res = [...list];
       if (searchName) {
            res = res.filter((el) =>  el.name.includes(searchName))
       }
       if (sortAge !== SORT.NO) {
            res.sort((a, b) => {
                if (sortAge === SORT.UP) {
                    return parseInt(a.age) - parseInt(b.age)
                } 
                 if (sortAge === SORT.DOWN) {
                    return parseInt(b.age) - parseInt(a.age)
                }
                
            })
       }
       return res;
   }
   const reactMemberToRender = React.useMemo(() => getUsers(reactMembers), [reactMembers, sortAge]);
   const javaMemberToRender = React.useMemo(() => getUsers(javaMembers), [javaMembers, sortAge]);
   
   const getSortText = () => {
        if (sortAge === SORT.NO) {
            return "no"
        }
        if (sortAge === SORT.UP) {
            return "up"
        }
        return "down"
   }

   const getSortTextCallback = React.useCallback(() => getSortText(), [sortAge])

   const handleSort = () => {
       if (sortAge  === SORT.DOWN) {
           setSortAge(SORT.NO)
       }  else if (sortAge  === SORT.NO) {
            setSortAge(SORT.UP)
       } else {
            setSortAge(SORT.DOWN)
       }
   }
   const onEditReactMember = (index) => {
       setFormData({
           ...reactMembers[index],
           isEdit: true,
           index: index,
           orginClassType:  reactMembers[index].classType,
        })
        inputNameRef.current.focus();
   }
   const onEditJavaMember = (index) => {
        setFormData({
            ...javaMembers[index],
            isEdit: true,
            index: index,
            orginClassType: javaMembers[index].classType,
        })
        inputNameRef.current.focus();
    }

        //delete member
    const handleDeleteReact = (index) => {
        reactMembers.splice(index, 1)
        setFormData([
            ...reactMembers
        ])
    }
    const handleDeleteJava = (index) => {
        javaMembers.splice(index, 1)
        setFormData([
            ...javaMembers
        ])
    }

    let inputNameRef = React.useRef();
    let testRef = React.useRef();
    const SortTitle = (props) => {
        React.useEffect(() => {
            console.log("fire by getSorttext");
        }, [props.getSortText])
        return (
            <React.Fragment>sort: {props.getSortText()}</React.Fragment>
        )
    }
    return (
        <div>
        <h1>list member of React class</h1>
        search name: <input
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            ></input>
            <br />
            <button
                onClick={() => handleSort()}
            ><SortTitle getSortText={getSortTextCallback}/></button>
            {reactMembers.length > 0 ? reactMemberToRender.map((user, index) => {
            return <Member name={user.name} age={user.age}
            key={index}
            handleTranfer={() => tranferReactToJavaMember(index)}
            handleEdit={() => onEditReactMember(index)} 
            handleDelete={() => handleDeleteReact(index)}

            //   renderExtend={() => <span>hello by react</span> 
            />
        }) : "empty class"}
        <h1>list member of Java class</h1>
            {javaMembers.length > 0 ? javaMemberToRender.map((user,index) => {
            return <Member name={user.name} age={user.age}
            key={index}
            handleTranfer={() => tranferJavaToReactMember(index)}
            handleEdit={() => onEditJavaMember(index)} 
            handleDelete={() => handleDeleteJava(index)}

             />
        }) : "empty class" }
        <h1>{formData.isEdit? "edit": "add"} member</h1>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <label>name</label>
            <input 
            name="name"
            ref={inputNameRef}

            value={formData.name}
            onChange={(e) => handleInput(e)}></input>
            {" --- "}
            <label>age</label>
            <input
            value={formData.age}
            name="age"
            onChange={(e) => handleInput(e)}
            ></input>
            <select
            name="classType"
            onChange={(e) => handleInput(e)}
            value={formData.classType}>
                <option value="react">React</option>
                <option value="java">Java</option>
            </select>
            <button >submit</button>
            <button type="button" onClick={() => setFormData(INIT_DATA)}>cancel</button>

            {/* checkme<input type="checkbox" name="testCheckbox" /> */}
        </form>

        </div>
    )

}

ReactDOM.render(<div>
    <TranferMember />
    </div>, divTag);







