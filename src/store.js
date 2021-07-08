import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

const errorSystem ={
    state: {
        show: false,
        text: 'Error'
    },
    mutations: {
        showError(state, message) {
            state.show = true;
            state.text = message;
        }
    }
}

export default new Vuex.Store({
    state: {
        students: []
    },
    getters: {
        students: state => state.students.map(s => ({
            ...s, fullName: s.firstName + ' ' + s.lastName
        })),
        findStudent: state => id => state.students.find(s => s.id == id),
        isLoaded: state => !!state.students.length
    },
    mutations: {
        setStudents(state, students) {
            state.students = students;
        },
        addStudent(state, student) {
            state.students.push(student);
        },
        editStudent(state, student) {
            const index = state.students.findIndex(s => s.id == student.id);
            Vue.set(state.students, index, student);
        }
    },
    actions: {
        async getStudents(context) {
            try {
                const students = (await axios.get('https://george-a-learning-vuex.vercel.app/students')).data;
                context.commit('setStudents', students);   
            } catch (error) {
                context.commit('showError', error);
            }

        },
        async createStudent(context, names ) {
            const student = (await axios.post("https://george-a-learning-vuex.vercel.app/students", names )).data;
            context.commit('addStudent', student);
        },
        async editStudent(context, {id, names}) {
            const student = (await axios.put(`https://george-a-learning-vuex.vercel.app/students/${id}`, names)).data;
            context.commit('editStudent', student);
        }
    },
    modules: {
        error: errorSystem
    }
})